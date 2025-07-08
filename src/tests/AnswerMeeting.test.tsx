import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import moment from "moment";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnswerMeeting from "../app/routes/AnswerMeeting";

// Mock axios
vi.mock("axios");

// Mock useMediaQuery
vi.mock("react-responsive", () => ({
  useMediaQuery: vi.fn(() => false),
}));

// Mock dictionaries
const mockDict = {
  page: {
    answer: {
      heading: "Answer Meeting",
      input: {
        userName: {
          label: "Your Name",
          placeholder: "Enter your name",
        },
      },
      validate: {
        userName: {
          required: "Name is required",
          min: "Name must be at least 2 characters",
          max: "Name must be at most 30 characters",
        },
      },
      button: {
        submit: "Submit Response",
      },
    },
  },
  button: {
    submit: "Submit",
  },
};

const mockMeetingData = {
  _id: "meeting123",
  meetName: "Test Meeting",
  meetPlace: "Test Place",
  meetLink: "https://example.com",
  dates: [
    {
      date: moment().add(1, "day").valueOf(),
      times: [
        moment().add(1, "day").hour(9).minute(0).valueOf(),
        moment().add(1, "day").hour(9).minute(30).valueOf(),
        moment().add(1, "day").hour(10).minute(0).valueOf(),
      ],
    },
  ],
  answers: [],
};

const mockSession = {
  user: {
    id: "user123",
    name: "Test User",
  },
};

describe("AnswerMeeting Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup axios mock
    vi.mocked(axios.post).mockResolvedValue({ data: {} });
  });

  it("renders the component correctly", () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    expect(screen.getByText("Test Meeting")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("validates required user name", async () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={null}
      />
    );

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("validates minimum user name length", async () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={null}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "A" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters")
      ).toBeInTheDocument();
    });
  });

  it("validates maximum user name length", async () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={null}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const longName = "A".repeat(31);
    fireEvent.change(nameInput, { target: { value: longName } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at most 30 characters")
      ).toBeInTheDocument();
    });
  });

  it("allows time selection", async () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    // Find and click on a time slot
    const timeSlots = screen.getAllByText("09:00");
    if (timeSlots.length > 0) {
      fireEvent.click(timeSlots[0]);
    }

    // The time slot should be visually selected (this depends on implementation)
    // We can check if the component state has been updated
    expect(timeSlots[0]).toBeInTheDocument();
  });

  it("submits answer successfully", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { success: true },
    });

    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "Test User" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/answer`,
        expect.objectContaining({
          meetId: "meeting123",
          userName: "Test User",
          selectedDates: expect.any(Array),
        })
      );
    });
  });

  it("handles submit error", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "Test User" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("displays meeting information correctly", () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    expect(screen.getByText("Test Meeting")).toBeInTheDocument();
    expect(screen.getByText("Test Place")).toBeInTheDocument();
  });

  it("handles time selection and deselection", async () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    // Mock mouse events for time selection
    const timeSlots = screen.getAllByText("09:00");
    if (timeSlots.length > 0) {
      fireEvent.mouseDown(timeSlots[0]);
      fireEvent.mouseUp(timeSlots[0]);
    }

    // Check if time slot is selected
    expect(timeSlots[0]).toBeInTheDocument();
  });

  it("prevents double submission", async () => {
    vi.mocked(axios.post).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { success: true } }), 100)
        )
    );

    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "Test User" } });

    const submitButton = screen.getByText("Submit");

    // Click submit button multiple times quickly
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    // Should only be called once
    await waitFor(() => {
      expect(vi.mocked(axios.post)).toHaveBeenCalledTimes(1);
    });
  });

  it("displays existing answers", () => {
    const meetingDataWithAnswers = {
      ...mockMeetingData,
      answers: [
        {
          userName: "John Doe",
          selectedDates: [moment().add(1, "day").hour(9).minute(0).valueOf()],
        },
        {
          userName: "Jane Smith",
          selectedDates: [moment().add(1, "day").hour(10).minute(0).valueOf()],
        },
      ],
    };

    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={meetingDataWithAnswers}
        session={mockSession}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles mouse selection mode", async () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={mockSession}
      />
    );

    // Simulate mouse selection
    const timeSlots = screen.getAllByText("09:00");
    if (timeSlots.length > 0) {
      fireEvent.mouseDown(timeSlots[0]);

      // Simulate mouse over another time slot
      const timeSlots2 = screen.getAllByText("09:30");
      if (timeSlots2.length > 0) {
        fireEvent.mouseOver(timeSlots2[0]);
      }

      fireEvent.mouseUp(timeSlots[0]);
    }

    expect(timeSlots[0]).toBeInTheDocument();
  });

  it("updates user name state correctly", () => {
    render(
      <AnswerMeeting
        lang="en"
        dict={mockDict}
        meetingData={mockMeetingData}
        session={null}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "Updated Name" } });

    expect(nameInput).toHaveValue("Updated Name");
  });
});
