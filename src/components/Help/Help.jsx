import React, { useState } from "react";

const Help = () => {
  const columnsData = [
    {
      title: "AC Type 1 (SAE J1772)",
      content: (
        <div className="mt-2 content">
          <p>
            <strong>Voltage:</strong> Typically operates at 220-240 volts AC.
          </p>
          <p>
            <strong>Power Output:</strong> Supports power levels ranging from
            3.3 kW to 22 kW, depending on the charging station's capability.
          </p>
          <p>
            <strong>Connector:</strong> Utilizes a single-phase connector, known
            as SAE J1772 connector.
          </p>
          <p>
            <strong>Charging Port:</strong> AC Type 1 charging port is compatible
            with the SAE J1772 connector.
          </p>
        </div>
      ),
      expanded: false
    },
    {
      title: "AC Type 2 (IEC 62196-2)",
      content: (
        <div className="mt-2 content">
          <p>
            <strong>Voltage:</strong> Operates at 220-240 volts AC, but can also
            support three-phase charging at higher voltages.
          </p>
          <p>
            <strong>Power Output:</strong> Supports power levels ranging from 3.3
            kW to 22 kW or higher, depending on the charging station's
            capability.
          </p>
          <p>
            <strong>Connector:</strong> Utilizes a single-phase or three-phase
            connector, based on the IEC 62196-2 standard.
          </p>
          <p>
            <strong>Charging Port:</strong> AC Type 2 charging port is compatible
            with the IEC 62196-2 connector.
          </p>
        </div>
      ),
      expanded: false
    },
    {
      title: "Tesla Charger (Tesla Supercharger)",
      content: (
        <div className="mt-2 content">
          <p>
            <strong>Voltage:</strong> Operates at high-voltage DC levels,
            typically ranging from 300 volts to 500 volts.
          </p>
          <p>
            <strong>Power Output:</strong> Offers rapid charging speeds, with
            power levels ranging from 72 kW to 250 kW or more, depending on the
            charging station's configuration.
          </p>
          <p>
            <strong>Connector:</strong> Tesla-specific connector designed for use
            with Tesla vehicles, including Model S, Model X, Model 3, and Model Y.
          </p>
          <p>
            <strong>Compatibility:</strong> Exclusively used with Tesla electric
            vehicles and available at Tesla Supercharger stations worldwide.
          </p>
          <p>
            <strong>Charging Port:</strong> Tesla vehicles are equipped with
            proprietary charging ports compatible with Tesla Supercharger
            connectors.
          </p>
        </div>
      ),
      expanded: false
    },
    {
      title: "GB/T (Guobiao/T)",
      content: (
        <div className="mt-2 content">
          <p>
            <strong>Voltage:</strong> Supports both AC and DC charging at various
            voltage levels, including single-phase and three-phase AC, as well as
            DC fast charging.
          </p>
          <p>
            <strong>Power Output:</strong> Can deliver power levels up to 22 kW
            for AC charging and higher for DC fast charging, depending on the
            charging station's capability.
          </p>
          <p>
            <strong>Connector:</strong> Utilizes GB/T connectors specified by
            Chinese national standards.
          </p>
          <p>
            <strong>Compatibility:</strong> Used predominantly in China's electric
            vehicle market and increasingly recognized internationally.
          </p>
          <p>
            <strong>Charging Port:</strong> GB/T charging port is compatible with
            GB/T connectors specified by Chinese standards.
          </p>
        </div>
      ),
      expanded: false
    }
  ];

  const [columns, setColumns] = useState(columnsData);

  const handleMouseEnter = (index) => {
    const updatedColumns = columns.map((column, i) => ({
      ...column,
      expanded: i === index
    }));
    setColumns(updatedColumns);
  };

  const handleMouseLeave = () => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      expanded: false
    }));
    setColumns(updatedColumns);
  };

  return (
    <div className="container mx-auto" style={{ backgroundColor: "#e2e8f0", minHeight: "100vh" }}>
      <h1 className="text-3xl font-bold text-center mt-8 mb-4" style={{padding:"50px 20px",fontSize:"2rem"}}>
        Specification About Charging Types
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column, index) => (
          <Column
            key={index}
            title={column.title}
            content={column.content}
            expanded={column.expanded}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  );
};

const Column = ({ title, content, expanded, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="p-4 cursor-pointer column"
      style={{
        backgroundColor: expanded ? "#f4f4f4" : "#e2e8f0",
        // border: "1px solid #cbd5e0",
        borderRadius: "8px",
        transition: "background-color 0.3s, border-color 0.3s"
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="font-bold">{title}</p>
      {expanded && content}
    </div>
  );
};

export default Help;
