import RecordForm from "@/components/RecordForm";

export default function AddRecordPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-[#ededed] mb-5">Add Record</h1>
      <RecordForm mode="record" />
    </div>
  );
}
