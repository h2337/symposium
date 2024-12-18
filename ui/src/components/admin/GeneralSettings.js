import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Form, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { getSettings, updateSettings } from "../../api/setting";

function GeneralSettings(props) {
  const [settings, setSettings] = useState({});
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    getSettings()
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            setSettings(responseBodyObject);
          });
        } else {
          toast.error("Failed to load the settings.");
        }
      })
      .catch((e) => toast.error("Failed to load the settings."));
  }, []);

  function handleChange(event) {
    if (event.target.name === "siteName") {
      setSiteName(event.target.value);
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    let siteNameParameter = siteName == "" ? settings.siteName : siteName;
    updateSettings({ siteName: siteNameParameter, token: props.token })
      .then((r) => {
        if (r.status === 200) {
          toast.success("Settings updated.");
          window.location.reload(false);
        } else {
          toast.error("Failed to update the settings, try again.");
        }
      })
      .catch((e) => toast.error("Failed to update the settings, try again."));
  }

  return (
    <Container>
      <Row>
        <Form>
          <Form.Group controlId="siteName" style={{ marginTop: "10px" }}>
            <Form.Label>Site name</Form.Label>
            <Form.Control
              type="text"
              defaultValue={settings.siteName}
              name="siteName"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(GeneralSettings);
