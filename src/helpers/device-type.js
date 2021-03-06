const deviceUUIDMap = new Map([
    [1,    {type: "SOCKET", channels: 1}],
    [2,    {type: "SOCKET_2", channels: 2}],
    [3,    {type: "SOCKET_3", channels: 3}],
    [4,    {type: "SOCKET_4", channels: 4}],
    [6,    {type: "SWITCH", channels: 1}],
    [5,    {type: "SOCKET_POWER", channels: 1}],
    [7,    {type: "SWITCH_2", channels: 2}],
    [8,    {type: "SWITCH_3", channels: 3}],
    [9,    {type: "SWITCH_4", channels: 4}],
    [10,   {type: "OSPF"}],
    [11,   {type: "CURTAIN"}],
    [12,   {type: "EW-RE"}],
    [13,   {type: "FIREPLACE"}],
    [14,   {type: "SWITCH_CHANGE", channels: 1}],
    [15,   {type: "THERMOSTAT", channels: 1}],
    [16,   {type: "COLD_WARM_LED"}],
    [17,   {type: "THREE_GEAR_FAN"}],
    [18,   {type: "SENSORS_CENTER"}],
    [19,   {type: "HUMIDIFIER"}],
    [22,   {type: "RGB_BALL_LIGHT"}],
    [23,   {type: "NEST_THERMOSTAT"}],
    [24,   {type: "GSM_SOCKET", channels: 1}],
    [25,   {type: "AROMATHERAPY"}],
    [26,   {type: "BJ_THERMOSTAT"}],
    [27,   {type: "GSM_UNLIMIT_SOCKET", channels: 1}],
    [28,   {type: "RF_BRIDGE"}],
    [29,   {type: "GSM_SOCKET_2", channels: 2}],
    [30,   {type: "GSM_SOCKET_3", channels: 3}],
    [31,   {type: "GSM_SOCKET_4", channels: 4}],
    [32,   {type: "POWER_DETECTION_SOCKET", channels: 1}],
    [33,   {type: "LIGHT_BELT"}],
    [34,   {type: "FAN_LIGHT"}],
    [35,   {type: "EZVIZ_CAMERA"}],
    [36,   {type: "SINGLE_CHANNEL_DIMMER_SWITCH"}],
    [38,   {type: "HOME_KIT_BRIDGE"}],
    [40,   {type: "FUJIN_OPS"}],
    [41,   {type: "CUN_YOU_DOOR", channels: 4}],
    [42,   {type: "SMART_BEDSIDE_AND_NEW_RGB_BALL_LIGHT"}],
    [45,   {type: "DOWN_CEILING_LIGHT"}],
    [46,   {type: "AIR_CLEANER"}],
    [49,   {type: "MACHINE_BED"}],
    [51,   {type: "COLD_WARM_DESK_LIGHT"}],
    [52,   {type: "DOUBLE_COLOR_DEMO_LIGHT"}],
    [53,   {type: "ELECTRIC_FAN_WITH_LAMP"}],
    [55,   {type: "SWEEPING_ROBOT"}],
    [56,   {type: "RGB_BALL_LIGHT_4"}],
    [57,   {type: "MONOCHROMATIC_BALL_LIGHT"}],
    [59,   {type: "MEARICAMERA"}],
    [1000, {type: "ZCL_HA_DEVICEID_ON_OFF_SWITCH"}],
    [1001, {type: "BLADELESS_FAN"}],
    [1002, {type: "NEW_HUMIDIFIER"}],
    [1003, {type: "WARM_AIR_BLOWER"}],
    [1770, {type: "ZCL_HA_DEVICEID_TEMPERATURE_SENSOR"}],
    [2026, {type: "ZIGBEE_MOBILE_SENSOR"}],
    [3026, {type: "ZIGBEE_DOOR_AND_WINDOW_SENSOR"}]
]);


module.exports = function getDeviceType(uuid) {
    return deviceUUIDMap.has(uuid) ? deviceUUIDMap.get(uuid) : {type: ''};
};