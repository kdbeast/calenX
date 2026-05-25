import { userType } from "./userTypes";
import { bookingType } from "./bookingTypes";
import { feedbackType } from "./feedbackType";
import { type SchemaTypeDefinition } from "sanity";
import { meetingTypeType } from "./meetingTypeType";
import { availabilitySlotType } from "./availabilitySlotType";
import { connectedAccountType } from "./connectedAccountType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userType,
    availabilitySlotType,
    connectedAccountType,
    bookingType,
    meetingTypeType,
    feedbackType,
  ],
};
