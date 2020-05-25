import React from 'react';
import MaterialTable, { Column } from 'material-table';
import { ToastContainer } from 'react-toastify';
import swal from 'sweetalert';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { DialogContent, DialogTitle } from '@material-ui/core';
import { useSelector } from 'react-redux';
import CardHeader from '../../../components/cardHeader/component';
import { useStyles, UserWrapper } from '../style';
import AddUser from './addUser';
import { showToast } from '../../../utils/utilities';
import { SUCCESS, DELETE_CONFIRMATION, WARNING } from '../../../core/config/constants';
import { DefaultStore } from '../../../core/Interface/store.interface';

interface Row {
    first: string;
    last: string;
    Role: string;
    email: string;
}

interface TableState {
    columns: Array<Column<Row>>;
    data: Row[];
}
interface UserListingProps {
    layout: { primary?: string };
}

const _initial = { first: '', email: '', last: '', Role: 'Admin' };

function UserListingComponent(props: UserListingProps) {
    const classes = useStyles();
    const { layout } = useSelector((state: DefaultStore) => state.settings);
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [isNewUser, setIsNewUser] = React.useState(true);
    const [list, setList] = React.useState(_initial);

    const descriptionElementRef = React.useRef<any>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);
    const [state, setState] = React.useState<TableState>({
        columns: [
            { title: 'Name', field: 'first' },
            { title: 'Surname', field: 'last' },
            { title: 'Email', field: 'email' },
            { title: 'Role', field: 'Role' },
        ],
        data: [
            { first: 'Steffy', last: 'John', Role: 'Manager', email: 'abc@gmail.com' },
            {
                first: 'Zerya Betül',
                last: 'Baran',
                Role: 'Executives',
                email: 'xyz@gmail.com',
            },
        ],
    });
    const deleteUser = (e, rowData) => {
        swal({
            text: DELETE_CONFIRMATION,
            icon: WARNING,
            buttons: {
                cancel: {
                    text: 'Cancel',
                    value: null,
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    className: layout.primary,
                },
            },
        }).then((isDelete) => {
            if (isDelete) {
                setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(rowData), 1);
                    return { ...prevState, data };
                });
                const toastObj = { type: SUCCESS, message: `User deleted successfully` };
                showToast(toastObj);
            }
        });
    };
    const onEditUser = (e, rowData) => {
        setList(rowData);
        setOpen(true);
        setIsNewUser(false);
    };
    const onRowEdit = (newData, oldData) => {
        setState((prevState) => {
            const data = [...prevState.data];
            data[data.indexOf(oldData)] = newData;
            return { ...prevState, data };
        });
    };
    const onRowAdd = (newData) => {
        setState((prevState) => {
            const data = [...prevState.data];
            data.push(newData);
            return { ...prevState, data };
        });
    };

    return (
        <UserWrapper>
            <CardHeader
                title="User"
                permssion={true}
                onClick={() => {
                    setOpen(true);
                    setIsNewUser(true);
                    setList(_initial);
                }}
            />
            <ToastContainer />

            <div className={classes.table}>
                <MaterialTable
                    title=""
                    columns={state.columns}
                    data={state.data}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit User',
                            onClick: onEditUser,
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete User',
                            onClick: deleteUser,
                        },
                    ]}
                    options={{
                        headerStyle: {
                            fontWeight: 'bold',
                        },
                        pageSizeOptions: [],
                    }}
                />
            </div>
            <Dialog
                open={open}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title" style={{ fontWeight: 'bold' }}>
                    {isNewUser ? 'Add User' : 'Edit User'}
                </DialogTitle>
                <DialogContent
                    style={{ paddingBottom: '10px' }}
                    ref={descriptionElementRef}
                    dividers={scroll === 'paper'}
                >
                    <AddUser
                        onClose={() => setOpen(false)}
                        isNewUser={isNewUser}
                        onRowAdd={onRowAdd}
                        list={list}
                        onRowEdit={onRowEdit}
                        {...props}
                    />
                </DialogContent>
            </Dialog>
        </UserWrapper>
    );
}

export default UserListingComponent;