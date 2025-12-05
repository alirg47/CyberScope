'use client';

import React from 'react';

interface CyberKillChainProps {
    activeStage?: number; // 0-6, defaults to 6 (Actions on Objectives)
}

const stages = [
    { id: 0, name: 'Reconnaissance', short: 'RECON' },
    { id: 1, name: 'Weaponization', short: 'WEAPON' },
    { id: 2, name: 'Delivery', short: 'DELIVERY' },
    { id: 3, name: 'Exploitation', short: 'EXPLOIT' },
    { id: 4, name: 'Installation', short: 'INSTALL' },
    { id: 5, name: 'C2', short: 'C2' },
    { id: 6, name: 'Actions on Objectives', short: 'ACTIONS' },
];

export default function CyberKillChain({ activeStage = 6 }: CyberKillChainProps) {
    return (
        <div className="cyber-kill-chain">
            <h3 className="kill-chain-title">Cyber Kill Chain Progression</h3>

            <div className="kill-chain-container">
                {/* Horizontal connecting line */}
                <div className="kill-chain-line" />

                {/* Stages */}
                <div className="kill-chain-stages">
                    {stages.map((stage, index) => {
                        const isActive = index <= activeStage;
                        const isCurrent = index === activeStage;

                        return (
                            <div key={stage.id} className="kill-chain-stage">
                                <div
                                    className={`
                    kill-chain-node 
                    ${isActive ? 'active' : 'inactive'}
                    ${isCurrent ? 'current' : ''}
                  `}
                                >
                                    <div className="node-inner" />
                                </div>
                                <div className="kill-chain-label">{stage.short}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
