
import { Layout } from "@/components/Layout";

const Config = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center bg-card">
          <p className="text-lg text-muted-foreground">
            Configuration management interface will be implemented here
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Config;
