import React from 'react';
import CommonLayout from '../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';

const Page404 = () => {
    return (
        // <CommonLayout parent="home" title="404">
            <section className="p-0">
                <Container>
                    <Row>
                        <Col sm="12">
                            <div className="error-section">
                                <h1>404</h1>
                                <h2>Recurso no encontrado</h2>
                                <a href="/" className="btn btn-solid">volver</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        // {/* </CommonLayout> */}
    )
}
export default Page404;