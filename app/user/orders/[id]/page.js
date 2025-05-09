import OrderDetailsClient from "@/app/components/orders/OrderDetailsClient";

export default async function OrderPage({ params }) {
  const { id } = await params;
  console.log(id);
  

  return (
    
      <OrderDetailsClient id={id} />
    
  );
}
