import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { mock } from 'node:test';
import * as request from 'supertest';
import { Appointment } from '../schemas/appointment.schema';
import { MeetService } from './meet.service';

describe('MeetService', () => {
  let meetService: MeetService;
  let model: Model<Appointment>;

  const mockMeet = {
    _id: '6554b7013fe16f6a95a1880a',
    appointmentId: 'aRuUkIY',
    meetName: 'Test Meet',
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

  const mockAppointmentModel = {
    find: jest.fn(),
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

  describe('findAll', () => {
    it('should return an array of meets', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockMeet]);

      const result = await meetService.findAll();

      expect(result).toEqual([mockMeet]);
    });
  });
});
