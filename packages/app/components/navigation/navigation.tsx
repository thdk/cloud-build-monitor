import { BuildOutlined, GithubOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const items: MenuProps['items'] = [
    {
        label: 'Builds',
        key: '/builds',
        icon: <BuildOutlined />
    },
    {
        label: 'Repos',
        key: '/repos',
        icon: <GithubOutlined />
    },
    {
        key: '/config',
        label: 'Config',
        icon: <SettingOutlined />,
        children: [
            {
                label: 'Build artifacts',
                key: '/config/build-artifacts',
            },
            {
                label: 'Build notifications',
                key: '/config/build-notifications',
            },
            {
                label: 'General',
                key: '/config/general',
            },
        ],
    },
];



export function Navigation() {
    const { push, asPath } = useRouter();

    const onClick: MenuProps['onClick'] = e => {
        push(
            e.key,
            undefined,
            {
                shallow: false,
            }
        );
    };

    const onOpenChange: MenuProps['onOpenChange'] = e => {
        setOpenKeys(e);
    };

    const [openKeys, setOpenKeys] = useState([asPath]);
    const [activeKey, setActiveKey] = useState(asPath);

    useEffect(
        () => {
            setActiveKey(asPath);
            setOpenKeys(
                asPath.split('/').reduce<string[]>(
                    (p, c, i) => {
                        switch (i) {
                            case 0:
                                break;
                            case 1:
                                p.push(`/${c}`);
                                break;
                            default:
                                p.push(`${p[i - 2]}/${c}`);
                                break;
                        }

                        return p;
                    },
                    []
                )
            );
        },
        [
            asPath,
        ],
    );

    return (
        <div
            style={{
                width: 184,
                marginLeft: 8,
                marginRight: 8.
            }}
            className="pt-32 fixed"
        >
            <Menu
                activeKey={activeKey}
                onClick={onClick}
                mode="inline"
                items={items}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            />
        </div>
    );
};
