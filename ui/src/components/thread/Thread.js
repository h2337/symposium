import React, { useState } from "react";
import { Spinner, Container, Row, Col, Badge, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadThread } from "../../api/thread";
import { loadCategories } from "../../api/category";
import { LOAD_CATEGORIES } from "../../redux/actionTypes";

function Thread(props) {
  const [thread, setThread] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(undefined);
  const { threadId } = useParams();
  useEffect(() => {
    if (props.thread === undefined) {
      loadThread(threadId)
        .then((r) => {
          if (r.status === 200) {
            r.text().then((responseBody) => {
              let responseBodyObject = JSON.parse(responseBody);
              setThread(responseBodyObject);
            });
          } else {
            toast.error("Failed to fetch the thread");
          }
        })
        .catch((e) => toast.error("Failed to fetch the thread."));
    } else {
      setThread(props.thread);
    }
    if (props.categories === undefined || props.categories.length === 0) {
      loadCategories()
        .then((r) => {
          if (r.status === 200) {
            r.text().then((responseBody) => {
              let responseBodyObject = JSON.parse(responseBody);
              setCategories(responseBodyObject.categories);
              props.onCategoryLoad(responseBodyObject.categories);
            });
          } else {
            toast.error("Failed to load the categories");
          }
        })
        .catch((e) => toast.error("Failed to load the categories"));
    } else {
      setCategories(props.categories);
    }
  }, []);

  useEffect(() => {
    if (categories !== undefined && categories.length > 0)
      setCategory(
        categories.find((category) => category.id === thread.categoryId)
      );
  }, [categories]);

  return (
    <>
      {thread === undefined || category === undefined ? (
        <Spinner
          style={{ margin: "auto", display: "table" }}
          animation="border"
        />
      ) : (
        <>
          <Container>
            <Row>
              <Col style={{ backgroundColor: "#" + category.color }}>
                <br></br>
                <Badge
                  pill
                  style={{ margin: "auto", display: "table" }}
                  variant="light"
                >
                  {category.name}
                </Badge>
                <h3 style={{ margin: "auto", display: "table" }}>
                  <Badge variant="light">{thread.title}</Badge>
                </h3>
                <br></br>
              </Col>
            </Row>
          </Container>
          <br></br>
          <Card>
            <Card.Body>Some text</Card.Body>
          </Card>
        </>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    thread: state.thread.currentThread,
    categories: state.category.categories,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onCategoryLoad: (categories) =>
    dispatch({ type: LOAD_CATEGORIES, categories }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
