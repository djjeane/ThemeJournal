import React, { useState } from "react";
import { Form, Range, Row, Col } from "react-bootstrap";
import "./Goals.css";

export default function Goals(props)
{
  const descriptions = props.descs;

  return (
    <div>
      {/* Make checkbox for each goal with the description */}
      {descriptions.map((desc, index) =>
      {
        return (
          <div className="goal-container">
            <Row>
              <Col>
                <Form.Label key={index}>{desc}</Form.Label>
              </Col>
              <Col>
                <Form.Range
                  key={index}
                  value={props.goals[index] ? props.goals[index] : 0}
                  onChange={(e) =>
                  {
                    props.setGoals(index, e.target.value);
                  }}
                  min={0}
                  max={10}
                />
              </Col>
            </Row>
          </div>
        );
      })}
    </div>
  );
}
