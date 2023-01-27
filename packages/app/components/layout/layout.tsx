import { PropsWithChildren } from "react";
import { Navigation } from "../navigation";
import { ConfigProvider, Layout as AntLayout } from "antd";
const { Header, Content } = AntLayout;

const headerStyle: React.CSSProperties = {
    paddingInline: 0,
    justifyContent: "center",
};

export function Layout({
    children,
}: PropsWithChildren<unknown>) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 2,
                    // colorBgLayout: '#00b96b',
                },
            }}
        >
            <AntLayout style={{ minHeight: '100vh' }}>
                <Header style={headerStyle}>
                    <Navigation />
                </Header>
                <Content
                >
                    {children}
                </Content>
            </AntLayout>
        </ConfigProvider>
    );
}
