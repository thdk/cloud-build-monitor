import { Checkbox, Form, FormInstance, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect } from "react";
import { ChatNotification } from "../../../../collections/chat-notifications/types";

const statusOptions = [
    { label: 'Success', value: 'success' },
    { label: 'Failure', value: 'failure' },
    { label: 'Timeout', value: 'timeout' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Working', value: 'working' },
    { label: 'Queued', value: 'queued' },
];

const threadOptions = [
    { label: 'Author', value: 'author' },
    { label: 'Sha', value: 'commit sha' },
    { label: 'Branch', value: 'branch' },
    { label: 'Status', value: 'status' },
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
                description: "",
                branchFilterRegex: "",
                threadKey: undefined,
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
                help="Hint: find the correct trigger name on the builds page"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
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
                label="Group notifications in threads by"
                name="threadKey"
            >
                <Select
                    options={threadOptions}
                    allowClear
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
