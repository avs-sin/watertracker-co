//
//  IntakeProgressView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI

/// Shows the progress on the main dashboard
struct IntakeProgressView: View {

    @EnvironmentObject var manager: DataManager

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Color.secondaryBackground.cornerRadius(20.0)
            ActionButtons
            CircularProgressView(target: manager.dailyIntakeGoal,
                                 current: manager.todayIntakeAmount,
                                 unit: manager.fluidUnits, lineWidth: 20, fontSize: 60)
            .padding(UIScreen.main.bounds.width * (!UIDevice.current.hasNotch ? 0.06 : 0.12))
        }.frame(height: UIScreen.main.bounds.width * (!UIDevice.current.hasNotch ? 0.8 : 1))
    }

    /// Action buttons
    private var ActionButtons: some View {
        VStack {
            HStack {
                Spacer()
                Button { manager.fullScreenMode = .history } label: {
                    Image(systemName: "chart.bar.xaxis")
                }
            }.padding(20).font(.system(size: 22))
            Spacer()
        }
    }
}

// MARK: - Preview UI
#Preview {
    let manager = DataManager()
    manager.dailyIntakeGoal = 2000
    manager.todayIntakeAmount = 750
    return IntakeProgressView().environmentObject(manager)
}
