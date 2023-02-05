import { Checkbox, Form, FormInstance, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect } from "react";
import { JiraUpdate } from "../../../../collections/jira-updates/types";

const statusOptions = [
    { label: 'Success', value: 'success' },
    { label: 'Failure', value: 'failure' },
    { label: 'Timeout', value: 'timeout' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Working', value: 'working' },
    { label: 'Queued', value: 'queued' },
];

export function JiraUpdateForm({
    data,
    form,
    create,
    update,
}: {
    data?: JiraUpdate | null | undefined;
    form: FormInstance<JiraUpdate>;
    create: (artifact: JiraUpdate) => void;
    update: (artifact: JiraUpdate) => void;
}) {

    const onFinish = (formValues: JiraUpdate) => {
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
        if (data) {
            form.setFieldsValue(
                data,
            );
        } else {
            form.resetFields();
        }
    }, [
        data,
        form,
    ]);

    const onFinishFailed = (errorInfo: ValidateErrorEntity<JiraUpdate>) => {
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
                help="A short but descriptive name used in overview table."
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                help="Explain the goal of this jira update"
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
                label="Issue regex"
                name="issueRegex"
                help="Leave blank to use default: '[A-Z][A-Z0-9]+-[0-9]+'"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Transition issue"
                name="transition"
                help="Name of Jira transition. Note: Current status => name of transition => New status"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Comment"
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
