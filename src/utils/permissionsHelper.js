const convertToModulePermissions = (data, baseModules) => {
    const result = { ...baseModules };

    Object.keys(data || {}).forEach(module => {
        const permString = data[module] || "";
        const permsArray = permString.split("|");

        result[module] = {
            read: permsArray.includes("read"),
            create: permsArray.includes("create"),
            update: permsArray.includes("update"),
            delete: permsArray.includes("delete"),
            all:
                permsArray.includes("read") &&
                permsArray.includes("create") &&
                permsArray.includes("update") &&
                permsArray.includes("delete")
        };
    });

    return result;
};

const handleShowPermissionsModal = useCallback((user) => {
    setSelectedUser(user);

    const parsed = parsePermissions(user.permissions);
    const base = initializePermissions();

    const formatted = convertToModulePermissions(parsed, base);

    setPermissions(formatted);
    setShowPermissionsModal(true);
}, [initializePermissions, parsePermissions]);

const convertToFieldPermissions = (data, base) => {
    const result = { ...base };

    Object.keys(data || {}).forEach(module => {
        if (!result[module]) return;

        Object.keys(data[module] || {}).forEach(field => {
            const permString = data[module][field] || "";
            const permsArray = permString.split("|");

            result[module].fields[field] = {
                read: permsArray.includes("read"),
                create: permsArray.includes("create"),
                update: permsArray.includes("update"),
                delete: permsArray.includes("delete")
            };
        });

        // ✅ set ALL flags
        const fields = result[module].fields;
        const keys = Object.keys(fields);

        if (keys.length > 0) {
            result[module].allRead = keys.every(f => fields[f].read);
            result[module].allCreate = keys.every(f => fields[f].create);
            result[module].allUpdate = keys.every(f => fields[f].update);
            result[module].allDelete = keys.every(f => fields[f].delete);
        }
    });

    return result;
};

const handleShowFieldPermissionsModal = useCallback((user) => {
    setSelectedUser(user);

    const parsed = parsePermissions(user.permited_fields);
    const base = initializeFieldPermissions();

    const formatted = convertToFieldPermissions(parsed, base);

    setFieldPermissions(formatted);
    setShowFieldPermissionsModal(true);
}, [initializeFieldPermissions, parsePermissions]);


export { convertToModulePermissions, convertToFieldPermissions };
