import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <Button variant={"elevated"}>Hello World</Button>
        <Input></Input>
        <Progress value={50}></Progress>
        <Textarea value={"Iam text area"}></Textarea>
        <Checkbox />
      </div>
    </div>
  );
}
