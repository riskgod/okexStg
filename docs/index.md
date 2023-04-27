#### reamde
1000, 0
500, 500        
500, 502   500 - 500 - price * take /2
501, 501

#### todo
apt 4小时 回测看看结果 100天的 4小时 回测结果
计算 std  stdev (min(n)close - min(n-1)close / min(n-1)close) 

542432314chenjh

EIP-4337 是以太坊社区提出的一项新的标准，称为 "Gas fee payment abstraction"，旨在简化以太坊交易费用的支付和管理。该提案目前还处于草案阶段，尚未正式实施。

在 EIP-4337 中，提出了一种新的交易费用支付机制，称为 "Ethereum Improvement Proposal 1559-style fee market"。在这种机制中，交易费用的支付不再需要直接指定 Gas Price 和 Gas Limit，而是通过一种更加简单和灵活的方式进行。

在新的交易费用支付机制中，交易发起者需要指定的是 "maxFeePerGas" 和 "maxPriorityFeePerGas" 两个参数，而不是 Gas Price 和 Gas Limit。"maxFeePerGas" 表示最大允许的每单位 Gas 费用，"maxPriorityFeePerGas" 表示优先级费用，用于鼓励矿工优先处理该交易。

