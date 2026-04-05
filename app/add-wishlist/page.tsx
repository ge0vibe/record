import RecordForm from "@/components/RecordForm";

export default function AddWishlistPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-[#ededed] mb-5">Add to Wishlist</h1>
      <RecordForm mode="wishlist" />
    </div>
  );
}
