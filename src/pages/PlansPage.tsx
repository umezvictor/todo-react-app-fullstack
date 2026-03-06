import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import PlanCard from "../components/PlanCard";

const createSession = async (email: string, priceId: string) => {
  const response = await axios.post("http://localhost:8080/sub/session", {
    email,
    priceId,
  });

  const { url } = response.data;

  window.location.href = url;
};

const plans = [
  { planId: 1, name: "Basic", price: 50000 },
  { planId: 2, name: "Standard", price: 20000 },
  { planId: 3, name: "Premium", price: 40000 },
];

export default function PlansPage() {
  //const { loading, data } = usePlans();
  const [selectedSession, setSelectedSession] = useState<null | string>(null);
  const { user } = useSelector((state: RootState) => state.user.value);

  //   if (loading) return <div>Loading...</div>;

  const handleClick = () => {
    if (user && selectedSession) {
      createSession(user.email, selectedSession);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="w-100" style={{ maxWidth: "900px" }}>
        <h1 className="fw-semibold fs-2">Choose a plan that works for you</h1>
        <div className="d-flex mt-4 gap-3">
          {plans &&
            plans.map((plan) => (
              <PlanCard
                name={plan.name}
                price={plan.price}
                key={plan.planId}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                planId={plan.planId} // likely you want plan.planId, not 0!
              />
            ))}
        </div>
        <button
          className="btn btn-danger w-100 py-3 px-5 rounded mt-3"
          disabled={!selectedSession}
          onClick={handleClick}
        >
          Purchase
        </button>
      </div>
    </div>
  );
}
