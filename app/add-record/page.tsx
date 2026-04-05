import RecordForm from "@/components/RecordForm";

export default function AddRecordPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Add Record</h1>
      <RecordForm mode="record" />
    </div>
  );
}
