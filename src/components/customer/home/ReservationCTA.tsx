import React from "react";
import { Button } from "@/components/ui/button";
import { Award, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const ReservationCTA: React.FC = () => {
  const navigate = useRouter();

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-50"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)`,
          }}
        ></div>
        <div className="relative z-10 px-8 py-16 text-center">
          <Award className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Reserve Your Table Today
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-3xl mx-auto">
            Experience exceptional dining with our gourmet menu in a cozy
            atmosphere. Perfect for family gatherings, romantic evenings, or
            business meetings.
          </p>
          <Button
            size="lg"
            onClick={() => navigate.push("/reservation")}
            className="bg-orange-500 hover:bg-orange-600 text-xl py-6 px-8"
          >
            <Calendar className="mr-2 h-6 w-6" />
            Book a Reservation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReservationCTA;
