import { useState } from "react";
import { scheduleApi } from "../../../api/scheduleApi";
import "./schedule.css";

// ==========================
// ENUMS FROM BACKEND
// ==========================
const departmentTypes = [
  { value: "MANAGEMENT", label: "Management" },
  { value: "SERVICE", label: "Service" },
  { value: "KITCHEN", label: "Kitchen" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "IT", label: "IT" },
  { value: "SECURITY", label: "Security" },
  { value: "QUALITY", label: "Quality" },
  { value: "INVENTORY", label: "Inventory" },
  { value: "ADMINISTRATION", label: "Administration" },
  { value: "ACCOUNTS", label: "Accounts" },
];

const scheduleTypes = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "EVENING", label: "Evening" },
  { value: "NIGHT", label: "Night" },
  { value: "FULL_DAY", label: "Full Day" },
  { value: "HALF_DAY", label: "Half Day" },
  { value: "HOLIDAY", label: "Holiday" },
  { value: "OFF", label: "Off" },
];

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function ScheduleBuilder() {
  const siteId = localStorage.getItem("siteId");

  const [shiftConfigs, setShiftConfigs] = useState([]);

  // ============================
  // ADD SHIFT
  // ============================
  const addShift = (day) => {
    setShiftConfigs([
      ...shiftConfigs,
      {
        weekDay: day,
        scheduleType: "",
        shiftHours: "",
        departmentRequirements: [],
      },
    ]);
  };

  // ============================
  // UPDATE SHIFT
  // ============================
  const updateShift = (index, field, value) => {
    const updated = [...shiftConfigs];
    updated[index][field] = value;
    setShiftConfigs(updated);
  };

  // ============================
  // ADD DEPARTMENT
  // ============================
  const addDepartment = (index) => {
    const updated = [...shiftConfigs];
    updated[index].departmentRequirements.push({
      department: "",
      requiredEmployees: "",
    });
    setShiftConfigs(updated);
  };

  // ============================
  // UPDATE DEPARTMENT
  // ============================
  const updateDepartment = (sIndex, dIndex, field, value) => {
    const updated = [...shiftConfigs];
    updated[sIndex].departmentRequirements[dIndex][field] = value;
    setShiftConfigs(updated);
  };

  // ============================
  // SAVE
  // ============================
  const handleSave = async () => {
    const payload = {
      siteId,
      shiftConfigs: shiftConfigs.map((s) => ({
        weekDay: s.weekDay,
        scheduleType: s.scheduleType,
        shiftHours: Number(s.shiftHours),
        departmentRequirements: s.departmentRequirements.map((d) => ({
          department: d.department,
          requiredEmployees: Number(d.requiredEmployees),
        })),
      })),
    };

    try {
      await scheduleApi.create(payload);
      alert("Schedule Saved ✅");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="schedule-grid-page">
      <h2>Weekly Schedule</h2>

      <table className="schedule-table">
        <thead>
          <tr>
            <th style={{ width: "120px" }}>Day</th>
            <th>Shift Configurations</th>
            <th style={{ width: "120px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              {/* DAY */}
              <td className="day-cell">{day}</td>

              {/* SHIFTS */}
              <td>
                {shiftConfigs
                  .filter((s) => s.weekDay === day)
                  .map((shift, sIndex) => (
                    <div key={sIndex} className="shift-row">

                      {/* Schedule Type */}
                      <select
                        value={shift.scheduleType}
                        onChange={(e) =>
                          updateShift(sIndex, "scheduleType", e.target.value)
                        }
                      >
                        <option value="">Type</option>
                        {scheduleTypes.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>

                      {/* Hours */}
                      <input
                        type="number"
                        placeholder="Hours"
                        value={shift.shiftHours}
                        onChange={(e) =>
                          updateShift(sIndex, "shiftHours", e.target.value)
                        }
                      />

                      {/* DEPARTMENTS */}
                      <div className="dept-container">
                        {shift.departmentRequirements.map((d, dIndex) => (
                          <div key={dIndex} className="dept-row">

                            <select
                              value={d.department}
                              onChange={(e) =>
                                updateDepartment(
                                  sIndex,
                                  dIndex,
                                  "department",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Department</option>
                              {departmentTypes.map((dep) => (
                                <option key={dep.value} value={dep.value}>
                                  {dep.label}
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              placeholder="Employees"
                              value={d.requiredEmployees}
                              onChange={(e) =>
                                updateDepartment(
                                  sIndex,
                                  dIndex,
                                  "requiredEmployees",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        className="add-dept-btn"
                        onClick={() => addDepartment(sIndex)}
                      >
                        + Department
                      </button>
                    </div>
                  ))}
              </td>

              {/* ADD SHIFT */}
              <td>
                <button
                  className="add-shift-btn"
                  onClick={() => addShift(day)}
                >
                  + Add Shift
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="save-btn" onClick={handleSave}>
        Save Schedule
      </button>
    </div>
  );
}