import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoyalty } from "@/hooks/use-loyalty";
import { Award, Gift } from "lucide-react";

export const LoyaltyCard = () => {
  // const { points, lifetimePoints, isLoading, redeemPoints } = useLoyalty();
  const isLoading = false;

  // const handleRedeem = () => {
  //   if (points >= 100) {
  //     redeemPoints.mutate(100);
  //   }
  // };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Loyalty Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Available Points</p>
              {/* <p className="text-2xl font-bold text-primary">{points}</p> */}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lifetime Points</p>
              {/* <p className="text-lg font-semibold">{lifetimePoints}</p> */}
            </div>
          </div>

          <Button
            className="w-full"
            // onClick={handleRedeem}
            // disabled={points < 100}
          >
            <Gift className="h-4 w-4 mr-2" />
            Redeem 100 Points for $5 Off
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
