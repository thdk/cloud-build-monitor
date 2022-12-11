import { List, Table } from 'antd';
import { CICCDBuild } from '../../interfaces/build';
import { BuildListItem } from '../build-list-item';
import antdStyles from "../../styles/antd.module.css";

export function BuildListItems({
  builds,
}: {
  builds: (CICCDBuild & { id: string })[];
}) {

  return (
    <List
      dataSource={builds}
      renderItem={BuildListItem}
    >
    </List>
  );
}
