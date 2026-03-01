
import { useState, useEffect } from 'react';
import { useIAMClientState } from './iam-client';

const useScopes = (menuName, subMenuName) => {
  const { IAMClientAuthContext } = useIAMClientState();
  const [scopes, setScopes] = useState<string[]>([]);

  useEffect(() => {
    if (IAMClientAuthContext && IAMClientAuthContext.menuAccessObject) {
      const accessMenuObj = IAMClientAuthContext.menuAccessObject;
      console.log(accessMenuObj, 'accessMenuObj');
      if (accessMenuObj) {
        const menu = accessMenuObj.find((menu) => menu.menuName === menuName);
        if (menu && menu.subMenuData) {
          menu.subMenuData.forEach(subMenu => {
            if (subMenu.subMenuName === subMenuName) {
              setScopes(subMenu.scopes);
            }
          });
        }
      }
    }
  }, [IAMClientAuthContext, menuName, subMenuName]);

  return scopes;
};

export default useScopes;
