
import { Layout } from "@/components/Layout";

const Logs = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Log Analysis</h2>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center bg-card">
          <p className="text-lg text-muted-foreground">
            Log analysis interface will be implemented here
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Logs;
