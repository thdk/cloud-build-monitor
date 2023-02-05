import { BuildOutlined, GithubOutlined, LinkOutlined, NotificationOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useRouter } from "next/router";
import { ComponentProps, useCallback, useEffect, useState } from "react";

const items: MenuProps['items'] = [
    {
        label: 'Builds',
        key: '/builds',
        icon: <BuildOutlined />,
    },
    {
        label: 'Artifacts',
        key: '/config/build-artifacts',
        icon: <LinkOutlined />,
    },
    {
        label: 'Notifications',
        key: 'notifications',
        icon: <NotificationOutlined />,
        popupOffset: [0,2],
        theme: "dark",
        children: [
            {
                label: "Chat alerts",
                key: "/config/build-notifications"
            },
            {
                label: "Jira updates",
                key: "/config/jira-updates"
            }
        ]
    },
    {
        label: 'Repos',
        key: '/repos',
        icon: <GithubOutlined />,
    },
    {
        key: '/config/general',
        label: 'Config',
        icon: <SettingOutlined />,
    },
];

// returns all keys that are 
// - equal to the requested keys
// - have a child that with a key equal to the requested key
const findKeyInMenuItems = (items: MenuProps['items'], key: string) => {
    return items?.reduce<string[]>(
        (p, c) => {
            if (!c?.key) {
                return p;
            }

            if (c.key.toString() === key) {
                p.push(key);
            }

            if (typeof (c as any).children !== undefined) {
                const children = findKeyInMenuItems((c as any).children, key);
                if (children.length) {
                    p.push(c.key.toString());
                    p.push(...children);

                }
            }

            return p;
        },
        [],
    ) || [];
}

export function Navigation({
    mode = "horizontal",
}: Pick<ComponentProps<typeof Menu>, "mode">) {
    const { push, asPath } = useRouter();

    const onClick: MenuProps['onClick'] = useCallback(
        e => {
            push(
                e.key,
                undefined,
                {
                    shallow: true,
                },
            );
        },
        [
            push,
        ],
    );

    const onOpenChange: MenuProps['onOpenChange'] = useCallback(
        e => {
            setOpenKeys(e);
        },
        [],
    );

    const [openKeys, setOpenKeys] = useState<string[]>([asPath]);
    const [activeKey, setActiveKey] = useState(asPath);

    useEffect(
        () => {
            setActiveKey(asPath);
            setOpenKeys(
                mode !== "horizontal"
                    ? findKeyInMenuItems(items, asPath) || []
                    : []
            );
        },
        [
            asPath,
            mode,
        ],
    );

    return (
        <div>
            <Menu
                theme="dark"
                style={{
                    justifyContent: "center",
                }}
                activeKey={activeKey}
                onClick={onClick}
                mode={mode}
                items={items}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            />
        </div>
    );
};
