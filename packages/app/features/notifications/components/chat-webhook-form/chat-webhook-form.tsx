import { Form, FormInstance, Input } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect } from "react";
import { ChatWebhook } from "../../../../collections/chat-webhooks/types";

export type ChatWebhookFormFields = ChatWebhook & { url: string };

export function ChatWebhookForm({
    hook,
    form,
    create,
    update,
}: {
    hook: ChatWebhook | null | undefined;
    form: FormInstance<ChatWebhookFormFields>;
    create: (hook: ChatWebhookFormFields) => void;
    update: (hook: ChatWebhookFormFields) => void;
}) {
    const onFinish = (formValues: ChatWebhookFormFields) => {
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
            hook || {
                name: "",
                id: undefined,
                url: "",
            });
    }, [
        hook,
        form,
    ]);

    const onFinishFailed = (errorInfo: ValidateErrorEntity<ChatWebhook>) => {
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
            initialValues={hook || {}}
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
                label="Name"
                name="name"
                required
            >
                <Input />
            </Form.Item>

            {
                <Form.Item
                    label="Webhook url"
                    name="url"
                    rules={[
                        {
                            required: !hook?.id,
                            message: 'Please add a google chat webhook url',
                        },
                    ]}
                    help={
                        hook?.id
                            ? "Leave blank to use previously saved webhook url"
                            : undefined
                    }
                >
                    <Input />
                </Form.Item>
            }
        </Form>
    )
}
