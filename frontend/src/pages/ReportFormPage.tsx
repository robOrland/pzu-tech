import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const ReportFormPage = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description || !address) {
      alert("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post("/api/tickets", {
        category,
        description,
        address,
      });
      if (response.data.success) {
        alert("Report submitted successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg mb-4 flex justify-start">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
        </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Report</CardTitle>
          <CardDescription>
            Report an issue to the city administration.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buraco">Buraco</SelectItem>
                  <SelectItem value="Iluminação">Iluminação</SelectItem>
                  <SelectItem value="Lixo">Lixo</SelectItem>
                  <SelectItem value="Sinalização">Sinalização</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Ex: Av. Paulista, 1000"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                minLength={5}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={10}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReportFormPage;
