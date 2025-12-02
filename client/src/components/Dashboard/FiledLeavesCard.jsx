import React, { useEffect, useState } from "react";
import { getMyLeaves } from "../../api/leaveAdmin";
import "../../styles/FiledLeavesCard.css";

export default function FiledLeavesCard() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMyLeaves();

        const total = data.length;
        const approved = data.filter(l => l.status === "APPROVED").length;
        const rejected = data.filter(l => l.status === "REJECTED").length;

        setLeaves(data);
        setStats({ total, approved, rejected });
      } catch (err) {
        console.error("Failed to load leaves:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="filed-leaves-card">
        <div className="filed-leaves-card__header">
            <h2 className="filed-leaves-card__title">Filed Leaves</h2>
        </div>

        <div className="filed-leaves-card__list">
            <div className="filed-leaves-card__item">
                <span className="material-symbols-outlined filed-leaves-card__icon">
                    event
                </span>

                <div className="filed-leaves-card__text">
                    <span className="filed-leaves-card__label">Submitted</span>
                    <span className="filed-leaves-card__value">{stats.total}</span>
                </div>
            </div>

            <div className="filed-leaves-card__item">
                <span className="material-symbols-outlined filed-leaves-card__icon">
                    event_available
                </span>

                <div className="filed-leaves-card__text">
                    <span className="filed-leaves-card__label">Approved</span>
                    <span className="filed-leaves-card__value">{stats.approved}</span>
                </div>
            </div>

            <div className="filed-leaves-card__item">
                <span className="material-symbols-outlined filed-leaves-card__icon">
                    event_busy
                </span>

                <div className="filed-leaves-card__text">
                    <span className="filed-leaves-card__label">Rejected</span>
                    <span className="filed-leaves-card__value">{stats.rejected}</span>
                </div>
            </div>
        </div>
    </div>
  );
}
