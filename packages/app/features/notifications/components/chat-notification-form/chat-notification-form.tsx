import { Checkbox, Form, FormInstance, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect, useMemo } from "react";
import { ChatNotification } from "../../../../collections/chat-notifications/types";
import { useChatWebhooks } from "../../hooks/use-chat-webhooks";

const statusOptions = [
    { label: 'Success', value: 'success' },
    { label: 'Failure', value: 'failure' },
    { label: 'Timeout', value: 'timeout' },
    { label: 'Cancelled', value: 'cancelled' },
    // notifications are not fetched for queued and working status to reduce github api calls (rate limit 5000 / hour)
    // { label: 'Working', value: 'working' },
    // { label: 'Queued', value: 'queued' },
];

const threadOptions = [
    { label: 'Author', value: 'author' },
    { label: 'Branch', value: 'branch' },
    { label: 'Sha', value: 'sha' },
    { label: 'Status', value: 'status' },
    { label: 'Trigger', value: 'trigger' },
];

const notifyFixOptions = [
    {
        label: "Also notify for 'success' if previous build had status 'failure'",
        value: "add",
    },
];

export function ChatNotificationForm({
    notification,
    form,
    create,
    update,
}: {
    notification?: ChatNotification | null | undefined;
    form: FormInstance<ChatNotification>;
    create: (artifact: ChatNotification) => void;
    update: (artifact: ChatNotification) => void;
}) {
    const [webhooks] = useChatWebhooks();

    const onFinish = (formValues: ChatNotification) => {
        if (formValues.id) {
            update(
                formValues,
            );
        } else {
            create(
                formValues,
            );
        }
    };

    // remove values in reference fields that still point to deleted data
    const validNotificationData = useMemo(
        () => {
            if (!notification) {
                return notification;
            }

            const {
                webhooks: selectedWebHooksIds,
                ...rest
            } = notification;

            return {
                webhooks: webhooks
                    ? selectedWebHooksIds
                        .filter((hookId) => !!webhooks.find((hook) => hook.id === hookId))
                        .sort((a, b,) => {
                            const webhookA = webhooks.find((hook) => hook.id === a);
                            const webhookB = webhooks.find((hook) => hook.id === b);

                            return (
                                (webhookA!.name < webhookB!.name)
                                    ? -1
                                    : (webhookA!.name > webhookB!.name)
                                        ? 1
                                        : 0
                            );
                        })
                    : undefined,
                ...rest,
            };
        },
        [
            webhooks,
            notification,
        ],
    );

    useEffect(() => {
        if (validNotificationData) {
            form.setFieldsValue(
                validNotificationData,
            );
        } else {
            form.resetFields();
        }
    }, [
        validNotificationData,
        form,
    ]);

    const onFinishFailed = (errorInfo: ValidateErrorEntity<ChatNotification>) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            form={form}
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                hidden
                name="id"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Short name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please add a short descriptive name',
                    },
                ]}
                help="A short but descriptive name used in notification overview table."
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                help="Explain the goal (or target audience) of this notification"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Trigger"
                name="buildTrigger"
                rules={[
                    {
                        required: true,
                        message: 'Please add a build trigger name',
                    },
                ]}
                help="Hint: find the correct trigger name on the builds page"
            >
                <Input />
            </Form.Item>


            <Form.Item
                label="Branch filter"
                name="branchFilterRegex"
                help="Only send message when branch name matches regex"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Enabled statuses"
                name="statuses"
            >
                <Checkbox.Group
                    options={statusOptions}
                />
            </Form.Item>

            <Form.Item
                label="Extra status rules"
                name="notifyFix"
            >
                <Select
                    allowClear
                    options={notifyFixOptions}
                />
            </Form.Item>

            <Form.Item
                label="Group notifications in threads by"
                name="threadKey"
            >
                <Select
                    options={threadOptions}
                    allowClear
                />
            </Form.Item>

            <Form.Item
                label="Webhooks"
                help="You can add new webhooks from the `Webhooks` tab"
                required
                name="webhooks"
            >
                <Select

                    mode="multiple"
                    options={webhooks?.map(({ id, name }) => ({
                        label: name,
                        value: id
                    })) || []}
                />
            </Form.Item>

            <Form.Item
                label="Message"
                name="message"
                rules={[
                    {
                        required: true,
                        message: 'Please add a message',
                    },
                ]}
                help={
                    <div>
                        <p>You can use the following placeholders:</p>
                        <ul>
                            <li>{"{{{id}}}"}: the unique identifier for the build</li>
                            <li>{"{{{status}}}"}: the build status</li>
                            <li>{"{{{trigger}}}"}: the name of the trigger that caused the build</li>
                            <li>{"{{{logUrl}}}"}: link to the build logs</li>
                            <li>{"{{{repo}}}"}: git repo</li>
                            <li>{"{{{branch}}}"}: if applicable, the git branch name which was used to run the build from</li>
                            <li>{"{{{sha}}}"}: git commit sha</li>
                            <li>{"{{{commitAuthor}}}"}: git commit author</li>
                            <li>{"{{{commitMessage}}}"}: git commit message</li>
                        </ul>
                        <p>You can use the following sections:</p>
                        <ul>
                            <li>{"{{#success}}This is only shown on success{{/success}}"}</li>
                            <li>{"{{#failure}}This is only shown on failure{{/failure}}"}</li>
                        </ul>
                        <a
                            href="https://developers.google.com/chat/api/guides/message-formats/text"
                        >
                            Click to learn which syntax you can use to format your chat messages.
                        </a>
                    </div>
                }
            >
                <TextArea
                    rows={6}
                />
            </Form.Item>



        </Form>
    )
}
