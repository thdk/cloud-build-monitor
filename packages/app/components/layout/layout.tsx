import { PropsWithChildren } from "react";
import { Navigation } from "../navigation";
import { Col, Layout as AntLayout, Row } from "antd";
const { Sider } = AntLayout;

export function Layout({
    children,
}: PropsWithChildren<unknown>) {
    return (
        <AntLayout style={{ minHeight: '100vh' }}
            hasSider
        >
            <Sider
                style={{ background: "inherit" }}
            >
                <Navigation />
            </Sider>
            <AntLayout
            >
                <Row>
                    <Col
                        span={23}
                    >
                        {children}
                    </Col>
                </Row>
            </AntLayout>
        </AntLayout>
    );
}
