import Layout from "@/components/layouts";
import { ReceivedMessagesList } from '@/components/ReceivedMessagesList';


export default function defaultPage() {
  return (
    <div>
      <Layout>
        <ReceivedMessagesList />
      </Layout>
    </div>
  );
}
