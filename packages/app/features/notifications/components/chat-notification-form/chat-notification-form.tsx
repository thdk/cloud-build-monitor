import { Checkbox, Form, FormInstance, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect } from "react";
import { ChatNotification } from "../../../../collections/chat-notifications/types";

const options = [
    { label: 'Success', value: 'success' },
    { label: 'Failure', value: 'failure' },
    { label: 'Timeout', value: 'timeout' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Working', value: 'working' },
    { label: 'Queued', value: 'queued' },
];

export function ChatNotificationForm({
    notification,
    form,
    create,
    update,
}: {
    notification?: ChatNotification;
    form: FormInstance<ChatNotification>;
    create: (artifact: ChatNotification) => void;
    update: (artifact: ChatNotification) => void;
}) {
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

    useEffect(() => {
        form.setFieldsValue(
            notification || {
                buildTrigger: "",
                message: "",
                webhookUrl: "",
                statuses: ["success", "failure"],
                id: undefined,
            });
    }, [
        notification,
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
            initialValues={notification}
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
                label="Trigger"
                name="buildTrigger"
                rules={[
                    {
                        required: true,
                        message: 'Please add a build trigger name',
                    },
                ]}
            >
                <Input />
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
            >
                <TextArea
                    rows={6}
                />
            </Form.Item>
            <Form.Item
                label="Enabled statuses"
                name="statuses"
            >
                <Checkbox.Group
                    options={options}
                />
            </Form.Item>

            <Form.Item
                label="Webhook url"
                name="webhookUrl"
                rules={[
                    {
                        required: true,
                        message: 'Please add a google chat webhook url',
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    )
}
