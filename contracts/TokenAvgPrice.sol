/*
CRYPTOBURGERS
Web: https://cryptoburgers.io
Telegram: https://t.me/cryptoburgersnft
*/

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract TokenAvgPrice is OwnableUpgradeable, PausableUpgradeable {
    using SafeMathUpgradeable for uint256;

    mapping(uint256 => uint256) private tokenPrices;
    uint256 private dayTimestamp;

    function initialize() public initializer {
        dayTimestamp = 86400 * 1000;
    }

    function setTokenPriceForDay(uint256 _dayTimestamp, uint256 _price) external returns(bool) {
        uint256 _day = _dayTimestamp.div(dayTimestamp);
        tokenPrices[_day] = _price;
        return true;
    }

    function getTokenPriceForDay(uint256 _dayTimestamp) external view returns(uint256) {
        uint256 _day = _dayTimestamp.div(dayTimestamp);
        require(tokenPrices[_day] != 0, 'Price is not set yet for this day!');
        return tokenPrices[_day];
    }

    function getAvgPrice(uint256 _startTimestamp, uint256 _endTimestamp) external view returns(uint256) {
        uint256 totalPrice = 0;
        uint256 count = 0;
        for (uint256 i = _startTimestamp; i <= _endTimestamp; i += dayTimestamp) {
            uint256 _day = i.div(dayTimestamp);
            uint256 price = tokenPrices[_day];
            if (price != 0) {
                count ++;
                totalPrice += price;
            }
        }
        uint256 avgPrice = totalPrice.div(count);
        return avgPrice;
    }
}
