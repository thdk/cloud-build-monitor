import { PropsWithChildren } from "react";
import { Navigation } from "../navigation";
import { Button, Col, ConfigProvider, Layout as AntLayout, Row } from "antd";
import { GithubOutlined } from "@ant-design/icons";
const { Header, Content } = AntLayout;

const headerStyle: React.CSSProperties = {
    paddingInline: 0,
};

export function Layout({
    children,
}: PropsWithChildren<unknown>) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 2,
                },
            }}
        >
            <AntLayout style={{ minHeight: '100vh' }}>
                <Header style={headerStyle}>
                    <Row
                        align="middle"
                    >
                        <Col flex={20}>
                            <Navigation />
                        </Col>
                        <Col flex={4}
                            md={4}
                            sm={0}
                            xs={0}

                            style={{
                                color: "white",

                            }}
                        >
                            <Row
                                justify="end"
                                align="middle"
                                style={{
                                    paddingRight: "2em"
                                }}
                            >

                                <Button
                                    icon={<GithubOutlined style={{
                                        verticalAlign: 'middle',
                                    }} />}
                                    href={"https://github.com/thdk/cloud-build-monitor/issues"}
                                    size="small"
                                >
                                    Report an issue
                                </Button>
                            </Row>
                        </Col>
                    </Row>

                </Header>
                <Content
                >
                    {children}
                </Content>
            </AntLayout>
        </ConfigProvider>
    );
}
