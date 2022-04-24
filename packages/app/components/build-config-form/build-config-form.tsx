import { Form, FormInstance, Input } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect } from "react";
import { BuildArtifact } from "../../collections/artifacts/types";

export function BuildConfigForm({
    artifact,
    form,
    create,
    update,
}: {
    artifact?: BuildArtifact;
    form: FormInstance<BuildArtifact>;
    create: (artifact: BuildArtifact) => void;
    update: (artifact: BuildArtifact) => void;
}) {
    const onFinish = (formValues: BuildArtifact) => {
        if (formValues.key) {
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
            artifact || { 
                artifactUrl: "",
                triggerName: "",
                title: "",
                key: "",
            })
    }, [
        artifact,
        form,
    ]);

    const onFinishFailed = (errorInfo: ValidateErrorEntity<BuildArtifact>) => {
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
            initialValues={artifact}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                hidden
                name="key"
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Trigger name"
                name="triggerName"
                rules={[
                    {
                        required: true,
                        message: 'Please add trigger name',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Artifact title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: 'Please add trigger title',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Artifact url"
                name="artifactUrl"
                rules={[
                    {
                        required: true,
                        message: 'Please add artifact url',
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    )
}
