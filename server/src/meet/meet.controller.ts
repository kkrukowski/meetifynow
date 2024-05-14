import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMeetDto } from './dto/create-meet.dto';
import { NewAnswerDto } from './dto/new-answer.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';
import { MeetService } from './meet.service';
import { SearchManyIdDto } from './dto/search-many-id.dto';

@Controller('meet')
export class MeetController {
  constructor(private readonly meetService: MeetService) {}

  @Post('/new')
  create(@Body() createMeetDto: CreateMeetDto) {
    return this.meetService.create(createMeetDto);
  }

  @Get()
  findAll() {
    return this.meetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetService.findOne(id);
  }

  @Get('db/:id')
  findOneByDbId(@Param('id') id: string[]) {
    return this.meetService.findOneByDbId(id);
  }

  @Post('db/many')
  findMany(@Body() req: any) {
    const id = req.data.id;
    return this.meetService.findMany(id);
  }

  @Patch(':meetId')
  addAnswer(
    @Param('meetId') meetId: string,
    @Body() newAnswerDto: NewAnswerDto,
  ) {
    return this.meetService.addAnswer(meetId, newAnswerDto);
  }
}
