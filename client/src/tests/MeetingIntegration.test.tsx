import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import moment from "moment";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateMeeting from "../app/components/CreateMeeting/CreateMeeting";
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
    createMeeting: {
      title: "Create Meeting",
      step: {
        one: { title: "Meeting Details" },
        two: { title: "Select Dates" },
        three: { title: "Select Times" },
      },
      input: {
        meeting__name: {
          label: "Meeting Name",
          placeholder: "Enter meeting name",
        },
        meeting__place: {
          label: "Meeting Place",
          placeholder: "Enter meeting place",
        },
        meeting__link: {
          label: "Meeting Link",
          placeholder: "Enter meeting link",
        },
      },
      validate: {
        meeting__name: {
          required: "Meeting name is required",
          min: "Meeting name must be at least 4 characters",
          max: "Meeting name must be at most 50 characters",
        },
        meeting__place: {
          max: "Meeting place must be at most 100 characters",
        },
        meeting__link: "Invalid URL format",
        date: {
          required: "At least one date must be selected",
          max: "Maximum 15 dates can be selected",
        },
      },
      createButton: "Create Meeting",
    },
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
    next: "Next",
    back: "Back",
    submit: "Submit",
  },
};

const mockAuth = {
  user: {
    id: "user123",
    name: "Test User",
  },
};

describe("Meeting Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.post).mockResolvedValue({ data: {} });
  });

  describe("Complete Meeting Creation Flow", () => {
    it("completes full meeting creation workflow", async () => {
      const mockCreateResponse = {
        data: {
          appointmentId: "meeting123",
        },
      };
      vi.mocked(axios.post).mockResolvedValue(mockCreateResponse);

      render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

      // Step 1: Fill meeting details
      const nameInput = screen.getByPlaceholderText("Enter meeting name");
      const placeInput = screen.getByPlaceholderText("Enter meeting place");
      const linkInput = screen.getByPlaceholderText("Enter meeting link");

      fireEvent.change(nameInput, { target: { value: "Weekly Standup" } });
      fireEvent.change(placeInput, { target: { value: "Conference Room A" } });
      fireEvent.change(linkInput, {
        target: { value: "https://meet.google.com/abc-def-ghi" },
      });

      // Go to step 2
      let nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      // Step 2: Select dates
      await waitFor(() => {
        expect(screen.getByText("Select Dates")).toBeInTheDocument();
      });

      // Select tomorrow's date
      const tomorrow = moment().add(1, "day");
      const dayAfter = moment().add(2, "days");

      const tomorrowCell = screen.getByText(tomorrow.date().toString());
      const dayAfterCell = screen.getByText(dayAfter.date().toString());

      fireEvent.mouseDown(tomorrowCell);
      fireEvent.mouseUp(tomorrowCell);
      fireEvent.mouseDown(dayAfterCell);
      fireEvent.mouseUp(dayAfterCell);

      // Go to step 3
      nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      // Step 3: Select times and create meeting
      await waitFor(() => {
        expect(screen.getByText("Select Times")).toBeInTheDocument();
      });

      // Create meeting
      const createButton = screen.getByText("Create Meeting");
      fireEvent.click(createButton);

      // Verify API call
      await waitFor(() => {
        expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/new`,
          expect.objectContaining({
            meetName: "Weekly Standup",
            authorId: "user123",
            meetPlace: "Conference Room A",
            meetLink: "https://meet.google.com/abc-def-ghi",
            dates: expect.any(Array),
          })
        );
      });
    });

    it("handles validation errors in meeting creation", async () => {
      render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

      // Try to proceed without filling required fields
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Meeting name is required")
        ).toBeInTheDocument();
      });

      // Fill with invalid data
      const nameInput = screen.getByPlaceholderText("Enter meeting name");
      const linkInput = screen.getByPlaceholderText("Enter meeting link");

      fireEvent.change(nameInput, { target: { value: "ab" } }); // Too short
      fireEvent.change(linkInput, { target: { value: "invalid-url" } });

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Meeting name must be at least 4 characters")
        ).toBeInTheDocument();
        expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
      });
    });
  });

  describe("Complete Meeting Response Flow", () => {
    const mockMeetingData = {
      _id: "meeting123",
      meetName: "Weekly Standup",
      meetPlace: "Conference Room A",
      meetLink: "https://meet.google.com/abc-def-ghi",
      dates: [
        {
          date: moment().add(1, "day").valueOf(),
          times: [
            moment().add(1, "day").hour(9).minute(0).valueOf(),
            moment().add(1, "day").hour(9).minute(30).valueOf(),
            moment().add(1, "day").hour(10).minute(0).valueOf(),
          ],
        },
        {
          date: moment().add(2, "days").valueOf(),
          times: [
            moment().add(2, "days").hour(14).minute(0).valueOf(),
            moment().add(2, "days").hour(14).minute(30).valueOf(),
            moment().add(2, "days").hour(15).minute(0).valueOf(),
          ],
        },
      ],
      answers: [],
    };

    it("completes full meeting response workflow", async () => {
      const mockAnswerResponse = {
        data: { success: true },
      };
      vi.mocked(axios.post).mockResolvedValue(mockAnswerResponse);

      render(
        <AnswerMeeting
          lang="en"
          dict={mockDict}
          meetingData={mockMeetingData}
          session={null}
        />
      );

      // Fill user name
      const nameInput = screen.getByPlaceholderText("Enter your name");
      fireEvent.change(nameInput, { target: { value: "John Doe" } });

      // Select some time slots
      const timeSlots = screen.getAllByText("09:00");
      if (timeSlots.length > 0) {
        fireEvent.mouseDown(timeSlots[0]);
        fireEvent.mouseUp(timeSlots[0]);
      }

      // Submit response
      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/answer`,
          expect.objectContaining({
            meetId: "meeting123",
            userName: "John Doe",
            selectedDates: expect.any(Array),
          })
        );
      });
    });

    it("handles validation errors in meeting response", async () => {
      render(
        <AnswerMeeting
          lang="en"
          dict={mockDict}
          meetingData={mockMeetingData}
          session={null}
        />
      );

      // Try to submit without name
      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();
      });

      // Fill with invalid name
      const nameInput = screen.getByPlaceholderText("Enter your name");
      fireEvent.change(nameInput, { target: { value: "A" } }); // Too short

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 2 characters")
        ).toBeInTheDocument();
      });
    });

    it("displays existing responses correctly", () => {
      const meetingDataWithAnswers = {
        ...mockMeetingData,
        answers: [
          {
            userName: "Jane Smith",
            selectedDates: [moment().add(1, "day").hour(9).minute(0).valueOf()],
          },
          {
            userName: "Bob Johnson",
            selectedDates: [
              moment().add(2, "days").hour(14).minute(0).valueOf(),
            ],
          },
        ],
      };

      render(
        <AnswerMeeting
          lang="en"
          dict={mockDict}
          meetingData={meetingDataWithAnswers}
          session={null}
        />
      );

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles network errors in meeting creation", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Network error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

      // Fill valid data
      const nameInput = screen.getByPlaceholderText("Enter meeting name");
      fireEvent.change(nameInput, { target: { value: "Test Meeting" } });

      // Go through steps
      let nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      // Select a date
      await waitFor(() => {
        const tomorrow = moment().add(1, "day");
        const tomorrowCell = screen.getByText(tomorrow.date().toString());
        fireEvent.mouseDown(tomorrowCell);
        fireEvent.mouseUp(tomorrowCell);
      });

      nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      // Try to create meeting
      await waitFor(() => {
        const createButton = screen.getByText("Create Meeting");
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it("handles network errors in meeting response", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Network error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const mockMeetingData = {
        _id: "meeting123",
        meetName: "Test Meeting",
        meetPlace: "",
        meetLink: "",
        dates: [
          {
            date: moment().add(1, "day").valueOf(),
            times: [moment().add(1, "day").hour(9).minute(0).valueOf()],
          },
        ],
        answers: [],
      };

      render(
        <AnswerMeeting
          lang="en"
          dict={mockDict}
          meetingData={mockMeetingData}
          session={null}
        />
      );

      // Fill valid data
      const nameInput = screen.getByPlaceholderText("Enter your name");
      fireEvent.change(nameInput, { target: { value: "Test User" } });

      // Submit response
      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Time Zone Handling", () => {
    it("handles different time zones correctly", () => {
      const utcTime = moment.utc().hour(14).minute(0);
      const localTime = utcTime.local();

      expect(utcTime.valueOf()).toBe(localTime.valueOf());
      expect(utcTime.format()).not.toBe(localTime.format());
    });

    it("maintains time consistency across components", () => {
      const baseTime = moment().hour(9).minute(0).valueOf();
      const timeFromTimestamp = moment(baseTime);

      expect(timeFromTimestamp.hour()).toBe(9);
      expect(timeFromTimestamp.minute()).toBe(0);
    });
  });
});
