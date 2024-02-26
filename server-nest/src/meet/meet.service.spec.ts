import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Appointment } from '../schemas/appointment.schema';
import { MeetService } from './meet.service';

describe('MeetService', () => {
  let meetService: MeetService;
  let model: Model<Appointment>;

  // Mock meet DTO
  const mockMeetDto = {
    meetName: 'Test Meet',
    place: 'Test Place',
    link: 'Test Link',
    dates: [
      {
        date: 1700089200000,
        times: [
          1700118000000, 1700119800000, 1700121600000, 1700123400000,
          1700125200000, 1700127000000, 1700128800000, 1700130600000,
          1700132400000, 1700134200000, 1700136000000, 1700137800000,
        ],
      },
    ],
    answers: [],
  };

  // Mock meet object
  const mockMeet = {
    _id: '6554b7013fe16f6a95a1880a',
    appointmentId: 'aRuUkIY',
    meetName: 'Test Meet',
    place: 'Test Place',
    link: 'Test Link',
    dates: [
      {
        date: 1700089200000,
        times: [
          1700118000000, 1700119800000, 1700121600000, 1700123400000,
          1700125200000, 1700127000000, 1700128800000, 1700130600000,
          1700132400000, 1700134200000, 1700136000000, 1700137800000,
        ],
        _id: '6554b7013fe16f6a95a1880b',
      },
    ],
    answers: [],
  };

  const correctId = 'aRuUkIY';

  // Mock dependencies from services
  const mockAppointmentModel = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetService,
        {
          provide: getModelToken(Appointment.name),
          useValue: mockAppointmentModel,
        },
      ],
    }).compile();

    meetService = module.get<MeetService>(MeetService);
    model = module.get<Model<Appointment>>(getModelToken(Appointment.name));
  });

  describe('create', () => {
    it('should create a new meet', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockMeet);

      const result = await meetService.create(mockMeetDto);

      expect(result).toEqual(mockMeet);
    });

    it('should throw an error if dto is invalid', () => {
      const invalidDto = {
        meetName: '',
        place: '',
        link: '',
        dates: [],
        answers: [],
      };

      expect(meetService.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of meets', async () => {
      // Mock the return value of the find method
      jest.spyOn(model, 'find').mockResolvedValue([mockMeet]);

      const result = await meetService.findAll();

      expect(result).toEqual([mockMeet]);
    });

    it('should throw an error if no meets are found', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([]);

      await expect(meetService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it("should return a meet's details", async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockMeet);

      const result = await meetService.findOne(correctId);

      expect(result).toEqual(mockMeet);
    });

    it('should throw an error if the meet is not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(meetService.findOne(correctId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
