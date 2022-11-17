import { Form, FormInstance, Input } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect } from "react";
import { Config, ConfigSection } from "../../types";

export function ConfigForm({
    config,
    form,
    create,
    update,
}: {
    config?: Config;
    form: FormInstance<Config>;
    create: (artifact: Config) => void;
    update: (artifact: Config) => void;
}) {
    const onFinish = (formValues: Config) => {
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
            config || { 
                description: "",
                section: ConfigSection.General,
                value: "",
                name: "",
            })
    }, [
        config,
        form,
    ]);

    const onFinishFailed = (errorInfo: ValidateErrorEntity<Config>) => {
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
            initialValues={config}
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
                label="Config name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please add config name',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Config value"
                name="value"
                rules={[
                    {
                        required: true,
                        message: 'Please add a config value',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
                <Input />
            </Form.Item>
        </Form>
    )
}
