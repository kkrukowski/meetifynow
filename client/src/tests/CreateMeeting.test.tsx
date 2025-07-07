import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import moment from "moment";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateMeeting from "../app/routes/CreateMeeting";

// Mock axios
vi.mock("axios");

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
  },
  button: {
    next: "Next",
    back: "Back",
  },
};

const mockAuth = {
  user: {
    id: "user123",
    name: "Test User",
  },
};

describe("CreateMeeting Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup axios mock
    vi.mocked(axios.post).mockResolvedValue({ data: {} });
  });

  it("renders the component correctly", () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    expect(screen.getByText("Create Meeting")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter meeting name")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter meeting place")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter meeting link")
    ).toBeInTheDocument();
  });

  it("validates required meeting name", async () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Meeting name is required")).toBeInTheDocument();
    });
  });

  it("validates minimum meeting name length", async () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    fireEvent.change(nameInput, { target: { value: "abc" } });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("Meeting name must be at least 4 characters")
      ).toBeInTheDocument();
    });
  });

  it("validates maximum meeting name length", async () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    const longName = "a".repeat(51);
    fireEvent.change(nameInput, { target: { value: longName } });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("Meeting name must be at most 50 characters")
      ).toBeInTheDocument();
    });
  });

  it("validates URL format for meeting link", async () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    const linkInput = screen.getByPlaceholderText("Enter meeting link");

    fireEvent.change(nameInput, { target: { value: "Test Meeting" } });
    fireEvent.change(linkInput, { target: { value: "invalid-url" } });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
    });
  });

  it("proceeds to next step with valid data", async () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    const placeInput = screen.getByPlaceholderText("Enter meeting place");
    const linkInput = screen.getByPlaceholderText("Enter meeting link");

    fireEvent.change(nameInput, { target: { value: "Test Meeting" } });
    fireEvent.change(placeInput, { target: { value: "Test Place" } });
    fireEvent.change(linkInput, { target: { value: "https://example.com" } });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Select Dates")).toBeInTheDocument();
    });
  });

  it("validates date selection requirement", async () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    // Fill first step
    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    fireEvent.change(nameInput, { target: { value: "Test Meeting" } });

    // Go to second step
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Try to proceed without selecting dates
    await waitFor(() => {
      const nextButton2 = screen.getByText("Next");
      fireEvent.click(nextButton2);
    });

    await waitFor(() => {
      expect(
        screen.getByText("At least one date must be selected")
      ).toBeInTheDocument();
    });
  });

  it("creates meeting successfully", async () => {
    const mockResponse = {
      data: {
        appointmentId: "meeting123",
      },
    };
    vi.mocked(axios.post).mockResolvedValue(mockResponse);

    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    // Fill meeting details
    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    fireEvent.change(nameInput, { target: { value: "Test Meeting" } });

    // Go to date selection
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Select a date (simulate clicking on a calendar cell)
    await waitFor(() => {
      const tomorrow = moment().add(1, "day");
      const dateCell = screen.getByText(tomorrow.date().toString());
      fireEvent.mouseDown(dateCell);
      fireEvent.mouseUp(dateCell);
    });

    // Go to time selection
    const nextButton2 = screen.getByText("Next");
    fireEvent.click(nextButton2);

    // Create meeting
    await waitFor(() => {
      const createButton = screen.getByText("Create Meeting");
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/new`,
        expect.objectContaining({
          meetName: "Test Meeting",
          authorId: "user123",
          meetPlace: "",
          meetLink: "",
          dates: expect.any(Array),
        })
      );
    });
  });

  it("handles create meeting error", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    // Fill meeting details
    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    fireEvent.change(nameInput, { target: { value: "Test Meeting" } });

    // Go to date selection
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Select a date
    await waitFor(() => {
      const tomorrow = moment().add(1, "day");
      const dateCell = screen.getByText(tomorrow.date().toString());
      fireEvent.mouseDown(dateCell);
      fireEvent.mouseUp(dateCell);
    });

    // Go to time selection
    const nextButton2 = screen.getByText("Next");
    fireEvent.click(nextButton2);

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

  it("updates meeting details state correctly", () => {
    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const nameInput = screen.getByPlaceholderText("Enter meeting name");
    const placeInput = screen.getByPlaceholderText("Enter meeting place");
    const linkInput = screen.getByPlaceholderText("Enter meeting link");

    fireEvent.change(nameInput, { target: { value: "Updated Meeting" } });
    fireEvent.change(placeInput, { target: { value: "Updated Place" } });
    fireEvent.change(linkInput, { target: { value: "https://updated.com" } });

    expect(nameInput).toHaveValue("Updated Meeting");
    expect(placeInput).toHaveValue("Updated Place");
    expect(linkInput).toHaveValue("https://updated.com");
  });

  it("handles back navigation correctly", () => {
    const mockPush = vi.fn();
    vi.mocked(require("next/navigation").useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
      route: "/",
    });

    render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
