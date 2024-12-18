import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCategories } from "../../api/category";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CreateNewCategoryModal from "./CreateNewCategoryModal";

function Categories(props) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    getCategories()
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            setCategories(responseBodyObject);
          });
        } else {
          toast.error("Failed to load the categories.");
        }
      })
      .catch((e) => toast.error("Failed to load the categories."));
  }

  return (
    <Container>
      <Row>
        <Col xs="10">
          <br></br>
          <CreateNewCategoryModal postCreateCallback={loadCategories} />
          <br></br>
          <br></br>
          {categories.map((v, i) => (
            <div>
              <div key={i}>
                <i
                  className="fa fa-circle"
                  style={{ color: "#" + v.color, fontSize: 10 }}
                ></i>{" "}
                {v.name}
                <div style={{ float: "right" }}>
                  <DeleteCategoryModal
                    name={v.name}
                    id={v.id}
                    postDeleteCallback={loadCategories}
                  />
                </div>
              </div>
              <hr></hr>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default connect(null)(Categories);
