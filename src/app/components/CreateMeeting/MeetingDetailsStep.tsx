import Input from "@/components/Input";
import { motion } from "framer-motion";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Inputs {
  meeting__name: string;
  meeting__place?: string;
  meeting__link?: string;
}

interface MeetingDetailsStepProps {
  delta: number;
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  dict: any;
  setMeetDetails: (details: any) => void;
  meetDetails: any;
}

const MeetingDetailsStep: React.FC<MeetingDetailsStepProps> = ({
  delta,
  register,
  errors,
  dict,
  setMeetDetails,
  meetDetails,
}) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Input
        label={dict.page.createMeeting.input.meeting__name.label}
        name="meeting__name"
        type="text"
        id="meeting__name"
        register={register}
        errorText={errors.meeting__name?.message?.toString()}
        error={!!errors.meeting__name}
        placeholder={dict.page.createMeeting.input.meeting__name.placeholder}
        onChange={(e) =>
          setMeetDetails({ ...meetDetails, name: e.target.value })
        }
        required={true}
      />
      <Input
        label={dict.page.createMeeting.input.meeting__place.label}
        name="meeting__place"
        type="text"
        id="meeting__place"
        register={register}
        errorText={errors.meeting__place?.message?.toString()}
        error={!!errors.meeting__place}
        placeholder={dict.page.createMeeting.input.meeting__place.placeholder}
        onChange={(e) =>
          setMeetDetails({ ...meetDetails, place: e.target.value })
        }
      />
      <Input
        label={dict.page.createMeeting.input.meeting__link.label}
        name="meeting__link"
        type="text"
        id="meeting__link"
        register={register}
        errorText={errors.meeting__link?.message?.toString()}
        error={!!errors.meeting__link}
        placeholder={dict.page.createMeeting.input.meeting__link.placeholder}
        onChange={(e) =>
          setMeetDetails({ ...meetDetails, link: e.target.value })
        }
      />
    </motion.div>
  );
};

export default MeetingDetailsStep;
