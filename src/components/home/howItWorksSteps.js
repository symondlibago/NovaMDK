import { ClipboardCheck, Stethoscope, Dna, PackageOpen } from "lucide-react";

// Shared by both How-it-works layouts (timeline + split) so switching the
// Design Studio layout only changes presentation, not content.
export const HIW_STEPS = [
  { title: "Free Assessment", desc: "Complete a brief, secure intake form detailing your health history and unique goals to see if you qualify.", Icon: ClipboardCheck },
  { title: "Provider Review", desc: "A licensed US specialist evaluates your profile to design a treatment plan explicitly tailored to your biology.", Icon: Stethoscope },
  { title: "Customized Treatment", desc: "Your provider formulates a precise dosage and medication schedule tailored exclusively for your body and goals.", Icon: Dna },
  { title: "Discreet Delivery", desc: "Medication is shipped rapidly and discreetly to your door, with unlimited ongoing access to your care team.", Icon: PackageOpen },
];
