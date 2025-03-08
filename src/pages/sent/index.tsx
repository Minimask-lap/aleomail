import Layout from "@/components/layouts";
import { SentMessagesList } from '@/components/SentMessagesList';


export default function defaultPage() {
  return (
    <div>
      <Layout>
        <SentMessagesList />
      </Layout>
    </div>
  );
}
