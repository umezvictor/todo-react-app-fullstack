interface PlanProps {
  setSelectedSession: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSession: string | null;
  planId: number;
  name: string;
  price: number;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CAD",
});

export default function PlanCard({
  planId,
  name,
  price,
  setSelectedSession,
  selectedSession,
}: PlanProps) {
  return (
    <div
      className={`card h-100 w-100 mb-3 me-3 ${
        selectedSession === planId.toString()
          ? "border-3 border-dark"
          : "border"
      } cursor-pointer`}
      style={{ minHeight: 350, cursor: "pointer" }}
      onClick={() => setSelectedSession(planId.toString())}
    >
      <div
        className="card-header fw-bold text-white"
        style={{
          borderRadius: "0.375rem",
          backgroundImage:
            "linear-gradient(to right, #06b6d4 0%, #3b82f6 100%)",
          padding: "1rem",
        }}
      >
        <h3 className="h5">{name}</h3>
        <p className="fw-light">{formatter.format(price / 100)}</p>
      </div>

      <div className="card-body border-bottom py-4 d-flex align-items-center">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-info text-white me-3"
          style={{ width: 24, height: 24 }}
        >
          {/* Replace with Bootstrap Icon if available */}
          <i className="bi bi-check" style={{ fontWeight: 900 }}></i>
          {/* or keep using your CheckIcon component */}
        </div>
        <div>
          <h3 className="text-muted mb-1 small">Monthly price</h3>
          <h3 className="fw-semibold">{formatter.format(price / 100)}</h3>
        </div>
      </div>
    </div>
  );
}
