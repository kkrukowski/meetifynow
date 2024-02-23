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
import { UpdateMeetDto } from './dto/update-meet.dto';
import { MeetService } from './meet.service';

@Controller('meet')
export class MeetController {
  constructor(private readonly meetService: MeetService) {}

  @Post()
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetDto: UpdateMeetDto) {
    return this.meetService.update(+id, updateMeetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetService.remove(+id);
  }
}
