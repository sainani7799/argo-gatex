import axios from "axios";
import { ActionTypes } from "./action-types";
import { IAMClientAuthActions } from "./reducers";
import { LoginUserDto, UserPermissionsDto } from "./user-models";
import MenuDivider from "antd/es/menu/MenuDivider";


export const loginUser = async (dispatch: React.Dispatch<IAMClientAuthActions>, loginPayload: LoginUserDto) => {
    const { authServerUrl, username, password ,unitId} = loginPayload
    //const service = new UsersService();
    const fileUploadPath = authServerUrl;


    try {
        dispatch({ type: ActionTypes.REQUEST_LOGIN });
        const response = await axios.post(`${authServerUrl}/authentications/login`, {
            username,
            password,
            unitId,
           
           
        });
        const res = response.data;//await service.login(loginPayload);
        if (res.status) {
            console.log(res.data);
            const aaa: any = res.data;
            localStorage.setItem('token', aaa.accessToken);
            const menuData: UserPermissionsDto = aaa.accessMenuObj;
            const data = {
                loading: false,
                isAuthenticated: true,
                user: {
                    userId: menuData.userId,
                    userName: menuData.userName,
                    contactNo: aaa.accessMenuObj.contactNo,
                    profilePicPath: aaa?.['filesData']?.[0]?.filePath?.slice(7) ? fileUploadPath + '/' + aaa?.['filesData']?.[0]?.filePath?.slice(7) : null,
                    roles: menuData.roleName.join(','),
                    externalRefNo: menuData.externalRefNo,
                    unitId:menuData.unitId,
                    unit:menuData.unit
                },
                defaultPlant: 'SRPL',
                defaultPlantCurrency: 'IDR',
                token: aaa.accessToken,
                menuAccessObject: menuData.menusData,
                errorMessage: '',
                unitId:menuData.unitId
                
            }
            dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data
        } else {
            throw Error(res.internalMessage);
        }
    } catch (error: any) {
        const errorMessage: any = { errorMessage: error.message };
        dispatch({ type: ActionTypes.LOGIN_ERROR, payload: errorMessage });
        throw Error(error.message);
    }
}

export const logout = async (dispatch: React.Dispatch<IAMClientAuthActions>) => {
    dispatch({ type: ActionTypes.LOGOUT });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
}